"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [filesData, setFilesData] = useState([]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFilesData = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        const newData = parsedData.slice(4, parsedData.length - 1);
        const transformedArray = transformAndRenameArray(newData);

        newFilesData.push({
          fileName: file.name.split('.').slice(0, -1).join('.'),
          data: transformedArray,
        });

        if (newFilesData.length === files.length) {
          setFilesData(newFilesData);
        }
      };
    });
  };

  const transformAndRenameArray = (arr) => {
    const filteredArray = arr.filter((item) => item.hasOwnProperty("__EMPTY"));

    const transformedArray = filteredArray.map((item) => {
      const {
        "Lokmanya Tilak College of Engineering, Navi Mumbai": SR_no,
        __EMPTY: erpID,
        __EMPTY_1: fullName,
        __EMPTY_2: gender,
        __EMPTY_3: DOB,
        ...rest
      } = item;

      return { SR_no, erpID, fullName, gender, DOB };
    });

    return transformedArray;
  };

  const handleDownloadZIP = async () => {
    const zip = new JSZip();

    filesData.forEach((fileData) => {
      const jsonString = JSON.stringify(fileData.data, null, 2);
      zip.file(`${fileData.fileName}.json`, jsonString);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "files.zip");
  };

  return (
    <div className="h-screen w-screen py-16 px-16">
      <div className="flex items-center gap-10">
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          multiple
          className="w-auto"
        />
      </div>

      {filesData.length > 0 && (
        <div>
          <h3>Map Columns:</h3>
          <Button type="button" onClick={handleDownloadZIP}>
            Download ZIP
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
