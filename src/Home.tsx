import React from 'react';

import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

import {
  Box,
  VStack,
  IconButton,
  HStack,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Menu,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  MenuGroup,
} from '@chakra-ui/react';

import { shen } from '@ishikawa-masashi/shenscript';
import { findOpenParen } from './utils/strings';
import { EvalExpressionIcon } from './icons/EvalExpressionIcon';
import { PlayIcon } from './icons/PlayIcon';
import { FileIcon } from './icons/FileIcon';

import {
  readContentsFrom,
  showOpenFilePicker,
} from './fileSystem/showOpenFilePicker';
import ConwaysGameOfLifeString from '/examples/ConwaysGameOfLife.txt?raw';
import VectorsString from '/examples/Vectors.txt?raw';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

let $:
  | {
      exec: (source: string) => Promise<any>;
    }
  | undefined = undefined;

const OutStream = class {
  constructor(
    public stream: { write: (char: number) => void },
    public name: string
  ) {}

  write(b: number) {
    return this.stream.write(b);
  }

  close() {
    return this.stream.close();
  }
};

let data = '';

export function Home() {
  const [results, setResults] = React.useState<string[]>([]);
  const fileRef = React.useRef<FileSystemFileHandle>();
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();

  const [code, setCode] = React.useState(ConwaysGameOfLifeString);

  const outputStreamRef = React.useRef({
    write(char: number) {
      if (char === 10) {
        console.log(data);
        results.push(data);
        setResults([...results]);
        data = '';
        return;
      }
      data += String.fromCharCode(char);

      return;
    },
  });

  React.useEffect(() => {
    const asyncCallback = async () => {
      $ = await shen({
        // InStream,
        OutStream,
        // openRead: (path) =>
        //   new InStream(fs.createReadStream(path), `filein=${path}`),
        // openWrite: (path) =>
        //   new OutStream(fs.createWriteStream(path), `fileout=${path}`),
        // stinput: new InStream(process.stdin, 'stinput'),
        stoutput: new OutStream(outputStreamRef.current, 'stoutput'),
        // sterror: new OutStream(process.stderr, 'sterror'),
      });
    };
    asyncCallback();
  }, []);

  const scrollBottomRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    scrollBottomRef?.current?.scrollIntoView();
  }, [results]);

  const evalAll = React.useCallback(() => {
    if (!editorRef.current) {
      return;
    }
    const editor = editorRef.current;
    const value = editor.getValue();

    $?.exec(value)
      .then((value) => setResults((values) => [...values, `${$?.show(value)}`]))
      .catch((reason) => {
        setResults((values) => [...values, `${reason}`]);
        // console.log(reason);
      });
  }, [setResults]);

  const evalExpression = React.useCallback(() => {
    if (!editorRef.current) {
      return;
    }
    const editor = editorRef.current;
    const selection = editor.getSelection();
    const position = editor.getPosition();
    const value = editor.getValue();
    const offset = editor.getModel()!.getOffsetAt(position!);

    // console.log(selection);
    // console.log(`value:${value}`);
    // console.log(`positon:${position}`);
    // console.log(`offset:${offset}`);
    // console.log(`char:${value[offset - 1]}`);

    const pos = findOpenParen(value, offset - 1);

    const source = value.substring(pos, offset);
    // console.log(`source:${source}`);

    $.exec(source)
      .then((value) => setResults((values) => [...values, `${$.show(value)}`]))
      .catch((reason) => {
        setResults((values) => [...values, `${reason}`]);
        // console.log(reason);
      });
  }, [setResults]);

  return (
    <HStack backgroundColor="gray.100" padding="24px">
      <VStack align="flex-start" height={'calc(100dvh - 48px)'}>
        <IconButton
          aria-label="Eval"
          colorScheme="blue"
          icon={<PlayIcon />}
          onClick={() => {
            evalAll();
          }}
        />
        <IconButton
          aria-label="Eval Expression"
          colorScheme="blue"
          icon={<EvalExpressionIcon />}
          onClick={() => {
            evalExpression();
          }}
        />
        <IconButton
          aria-label="Eval Expression"
          colorScheme="blue"
          icon={<FileIcon />}
          onClick={async () => {
            fileRef.current = await showOpenFilePicker();
            const contents = await readContentsFrom(fileRef.current);
            editorRef.current?.setValue(contents);
          }}
        />
        <Menu>
          <MenuButton
            as={IconButton}
            colorScheme="blue"
            aria-label="Options"
            icon={<FontAwesomeIcon size="2x" icon={faBook} />}
            variant="outline"
          />
          <MenuList minWidth="240px">
            <MenuGroup title="Examples">
              <MenuItem
                onClick={() => {
                  setCode(VectorsString);
                }}
              >
                Vectors
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCode(ConwaysGameOfLifeString);
                }}
              >
                Conway's Game Of Life
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </VStack>

      <HStack width="100%" height="100%">
        <Box width="70%" height="100%">
          <Editor
            height={'calc(100dvh - 48px)'}
            width="100%"
            // defaultLanguage="scheme"
            // defaultValue={ConwaysGameOfLifeString}
            value={code}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.addCommand(monaco.KeyCode.F9, () => {
                evalExpression();
                return;
              });
            }}
          />
        </Box>
        <Box
          width="30%"
          height={'calc(100dvh - 48px)'}
          overflowY="scroll"
          backgroundColor="white"
          padding="6px"
        >
          {results.map((value, key) => (
            <pre key={key}>
              {`${key + 1} >`}
              {value}
            </pre>
          ))}
          <div ref={scrollBottomRef} />
          <Box height="60%"></Box>
        </Box>
      </HStack>
    </HStack>
  );
}
