package lib

import (
	"encoding/json"
	"io"
	"slices"
)

type Chunk struct {
	File           string   `json:"file"`
	Name           string   `json:"name"`
	Src            string   `json:"src"`
	CSS            []string `json:"css"`
	IsDynamicEntry bool     `json:"isDynamicEntry"`
	IsEntry        bool     `json:"isEntry"`
	Imports        []string `json:"imports"`
	DynamicImports []string `json:"dynamicImports"`
}

type Manifest map[string]*Chunk

type InjectChunk struct {
	JsFile  []string
	CssFile []string
}

// GetEntryPoint returns the entry point from the Vite manifest.
func (m Manifest) GetEntryPoint() *Chunk {
	for _, chunk := range m {
		if chunk.IsEntry {
			return chunk
		}
	}
	return nil
}

func parseManifest(r io.Reader) (Manifest, error) {
	var m Manifest
	if err := json.NewDecoder(r).Decode(&m); err != nil {
		return nil, err
	}
	return m, nil
}

func GetInjectChunk(r io.Reader) (*InjectChunk, error) {
	injectChunk := &InjectChunk{}
	manifest, err := parseManifest(r)
	if err != nil {
		return nil, err
	}
	entry := manifest.GetEntryPoint()
	injectChunk.JsFile = append(injectChunk.JsFile, entry.File)
	injectChunk.CssFile = append(injectChunk.CssFile, entry.CSS...)

	//Recursively import css
	var CSSRecursion func(Chunk)
	CSSRecursion = func(c Chunk) {
		for _, i := range c.Imports {
		CSSImportLoop:
			for _, css := range manifest[i].CSS {
				if slices.Contains(injectChunk.CssFile, css) {
					continue CSSImportLoop
				}
				injectChunk.CssFile = append(injectChunk.CssFile, css)
			}
			CSSRecursion(*manifest[i])
		}
	}

	CSSRecursion(*entry)

	return injectChunk, nil
}
