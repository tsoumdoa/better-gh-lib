export interface Wire {
  from: string;
  to: string;
}

export interface InputPort {
  description?: string;
  nick: string;
  source?: string;  // References component id
  optional?: boolean;
}

export interface OutputPort {
  description?: string;
  nick: string;
  optional?: boolean;
}

export interface Component {
  id: string;           // Unique identifier (e.g., "Area_1", "Brep_2")
  type: string;         // Component type (e.g., "Area", "Brep")
  guid: string;         // Original InstanceGuid
  description?: string;
  nickName: string;     // Display name (may have duplicates)
  inputs: Record<string, InputPort>;
  outputs: Record<string, OutputPort>;
  script?: {
    language?: string;   // e.g., "python", "csharp"
    code: string;        // Decoded source code
    title?: string;      // Script title/name
  };
  members?: string[];   // For Group components: list of component IDs in the group
  expression?: string;  // For Expression components: the expression formula
  value?: ComponentValue; // For input components: slider values, panel text, value list items, etc.
}

export interface ComponentValue {
  type: 'slider' | 'panel' | 'valueList' | 'number' | 'text';
  // Slider specific
  min?: number;
  max?: number;
  current?: number;
  digits?: number;
  interval?: number;
  // Panel/Text specific
  text?: string;
  // Value List specific
  items?: Array<{
    name: string;
    expression: string;
    selected: boolean;
  }>;
  selectedIndex?: number;
}

export interface ParsedGrasshopper {
  version: string;
  components: Record<string, Component>;  // Keyed by unique id
  wires: Wire[];
  metadata?: {
    pluginVersion?: string;
    documentId?: string;
    libraries?: Array<{
      name: string;
      version: string;
      author?: string;
    }>;
  };
}
