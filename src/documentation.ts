export type Variant = {
  name: string;
  args: string[];
};

export type Item =
  | {
      type: "value";
      name: string;
      signature: string;
      docComment?: string;
    }
  | {
      type: "adt";
      name: string;
      params: string[];
      variants?: Variant[];
      docComment?: string;
    };

export type ModuleDoc = {
  moduleName: string;
  items: Item[];
};

export type ProjectDoc = {
  modules: Record<string, ModuleDoc>;
};
