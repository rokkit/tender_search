package main

import (
	"io/ioutil"
	"net/http"

	"github.com/tealeg/xlsx"
	"encoding/json"
	"fmt"
)

func uploadFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", r.Header.Get("Origin"))
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	fmt.Println("File Upload Endpoint Hit")

	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)
	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	// read all of the contents of our uploaded file into a
	// byte array
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		fmt.Println(err)
	}

	names := parseSheet(fileBytes)
	respJSON, _ := json.Marshal(names)
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(respJSON))
}

func parseSheet(content []byte) []string {
	xlFile, err := xlsx.OpenBinary(content)
	if err != nil {
		fmt.Printf("%s\n", err)
	}

	var names []string
	for _, sheet := range xlFile.Sheets {
		for _, row := range sheet.Rows {
			cell := row.Cells[0]
			name := cell.String()
			names = append(names, name)
		}
	}

	return names
}

func main() {
	http.HandleFunc("/upload", uploadFile)
	http.ListenAndServe(":7001", nil)
}
