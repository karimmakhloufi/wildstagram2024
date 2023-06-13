import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, FlatList, Button } from "react-native";
import singleFileUploader from "single-file-uploader";

export default function ImagesScreen() {
  const [imagesURI, setImagesURI] = useState([]);
  useEffect(() => {
    (async () => {
      // we get the photos from the photos directory instead of the imagemanipulator cache
      const images = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + "photos"
      );
      setImagesURI(images);
    })();
  }, []);
  return imagesURI.length > 0 ? (
    <FlatList
      data={imagesURI}
      keyExtractor={(imageURI) => imageURI}
      renderItem={(itemData) => {
        console.log("item", itemData);
        return (
          <>
            <Image
              style={styles.image}
              source={{
                uri: FileSystem.documentDirectory + "photos/" + itemData.item,
              }}
            />
            <Button
              title="upload"
              onPress={async () => {
                try {
                  await singleFileUploader({
                    distantUrl:
                      "https://wildstagram.nausicaa.wilders.dev/upload",
                    expectedStatusCode: 200,
                    filename: itemData.item,
                    filetype: "image/jpeg",
                    formDataName: "fileData",
                    localUri:
                      FileSystem.documentDirectory + "photos/" + itemData.item,
                    uri:
                      FileSystem.documentDirectory + "photos/" + itemData.item,
                    token: Constants.manifest.extra.token,
                  });
                  alert("Uploaded");
                } catch (err) {
                  alert("Error");
                  console.log("error while uploading");
                  console.log(err);
                }
              }}
            />
          </>
        );
      }}
    />
  ) : null;
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    height: 500,
  },
});
