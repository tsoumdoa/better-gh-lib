# Grasshopper XML Parser

A TypeScript/Bun parser for Grasshopper XML definitions that converts them into an LLM-friendly JSON format.

## Installation

```bash
bun install
```

## Usage

```bash
# Parse a single file
bun run parse <input.xml> [output.json]

# Example
bun run parse brep-area-Wire_1.xml
bun run parse brep-area-Wire_1.xml my-output.json
```

## Output Format

The parser produces a clean, semantic JSON structure:

```json
{
  "version": "0.2.2",
  "components": {
    "Brep": {
      "type": "Brep",
      "guid": "fb6c9287-cd45-4367-b9ba-f7db4cadbbb8",
      "description": "Contains a collection of Breps",
      "nickName": "Brep",
      "inputs": {},
      "outputs": {}
    },
    "Area": {
      "type": "Area",
      "guid": "bfd08430-973c-49e8-adab-04487445d763",
      "description": "Solve area properties for breps",
      "nickName": "Area",
      "inputs": {
        "g": {
          "description": "Brep, mesh or planar closed curve for area computation",
          "nick": "G",
          "optional": false,
          "source": "fb6c9287-cd45-4367-b9ba-f7db4cadbbb8"
        }
      },
      "outputs": {
        "a": { "description": "Area of geometry", "nick": "A", "optional": true },
        "c": { "description": "Area centroid of geometry", "nick": "C", "optional": true }
      }
    }
  },
  "wires": [
    { "from": "Brep", "to": "Area.g" }
  ],
  "metadata": {
    "documentId": "58d3bae9-a249-4f42-bf8e-ac59687c19d8",
    "libraries": [...]
  }
}
```

## Benefits

- **Token efficient**: ~60 lines vs 785 lines (93% reduction)
- **Semantic**: Human-readable component names and wire references
- **Clean structure**: No empty arrays or visual metadata clutter
- **LLM-friendly**: Easy for AI to understand the graph topology


## Current Capabilities
- Can parse most compoenents and inputs/outputs wires
- Can parse code blocks (python and c#)

## Capabilities to be added
- Parse compoennt location and size
- Parse component parameter's pivot point

