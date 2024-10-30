export const LANGUAGE_VERSIONS = {
  javascript: '18.15.0',
  python: '3.10.0',
  java: '15.0.2',
  typescript: '5.0.3',
  csharp: '6.12.0',
  php: '8.2.3',
};

export const CODE_SNIPPETS = {
  javascript: `function greet(name) {\n  console.log("Hello, " + name);\n}\ngreet("World");`,
  python: `def greet(name):\n  print("Hello, " + name)\ngreet("World")`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World");\n  }\n}`,
  typescript: `type Params = { name: string };\nfunction greet(data: Params) {\n  console.log("Hello, " + data.name);\n}\ngreet({ name: "World" });`,
  csharp: `using System;\nclass HelloWorld {\n  static void Main() {\n    Console.WriteLine("Hello World!");\n  }\n}`,
  php: `<?php\necho "Hello, World!";\n?>`,
};
