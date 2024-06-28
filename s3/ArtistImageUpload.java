package com.amazonaws.assignment01.s3;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ArtistImageUpload {
    //defining the  bucket name
    private static final String bucketName = "s3981218-artist-images";

    public static void main(String[] args) {
        Regions clientRegion = Regions.US_EAST_1;

        try {
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withRegion(clientRegion)
                    .build();

            //ObjectMapper to perse JSON data
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(new File("a1.json"));
            JsonNode songsNode = rootNode.path("songs");

            Set<String> uploadedArtists = new HashSet<>(); //set to track the uploaded artist images

            for (JsonNode node : songsNode){
                //grabing the url for the image from the a1.json file
                String imageUrl = node.path("img_url").asText();
                //grabbing the artist name to save the respective image using this name
                String artist = node.path("artist").asText().replace(" ", "");

                //checking if the artist is already uploaded and uploading the image using dlUlImage function
                if(!uploadedArtists.contains(artist)){
                    dlUlImage(imageUrl, artist, s3Client);
                    uploadedArtists.add(artist);
                }
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void dlUlImage(String imageUrl, String artist, AmazonS3 s3client) throws IOException {
        //creating url for image
        //Reference: https://docs.oracle.com/javase/7/docs/api/java/net/URL.html
        URL url = new URL(imageUrl);
        //Reference: https://docs.oracle.com/javase/7/docs/api/java/net/URL.html#openStream()
        InputStream inputStream = url.openStream(); //to read the url
        //creating the file to be saved as jpg
        File imageFile = new File(artist + ".jpg");

        //outputstream to write the image file
        //Reference: https://docs.oracle.com/javase/7/docs/api/java/io/OutputStream.html
        try (OutputStream outputStream = new FileOutputStream(imageFile)) {
            byte[] buffer = new byte[2048];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
        }

        ObjectMetadata metadata = new ObjectMetadata();
        //setting content type
        metadata.setContentType("image/jpeg");
        FileInputStream fileInputStream = new FileInputStream(imageFile);
        //upload request
        //Reference: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl
        PutObjectRequest putRequest = new PutObjectRequest(bucketName, artist + ".jpg", fileInputStream, metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead); // Setting the ACL to PublicRead

        //executing the request
        s3client.putObject(putRequest);
        fileInputStream.close(); // Close the FileInputStream after the upload
        Files.delete(Paths.get(imageFile.getPath())); //temporary file
        System.out.println("Uploaded " + artist + "'s image to s3981218-artist-images S3 with public access");
    }
}
