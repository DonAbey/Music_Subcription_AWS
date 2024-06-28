// Copyright 2012-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

package com.amazonaws.assignment01.dynamodb;

import java.io.File;
import java.util.Iterator;

import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class MusicLoadData {

    public static void main(String[] args) throws Exception {

        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
                .withRegion(Regions.US_EAST_1)
                .withCredentials(new ProfileCredentialsProvider("default"))
                .build();

        DynamoDB dynamoDB = new DynamoDB(client);

        Table table = dynamoDB.getTable("music");

        JsonParser parser = new JsonFactory().createParser(new File("a1.json"));

        //getting songs
        JsonNode rootNode = new ObjectMapper().readTree(parser);
        //accessing songs array
        JsonNode songsNode = rootNode.path("songs");

        Iterator<JsonNode> iter = songsNode.iterator();

        ObjectNode currentNode;

        while (iter.hasNext()) {
            currentNode = (ObjectNode) iter.next();

            String title = currentNode.path("title").asText();
            String artist = currentNode.path("artist").asText();
            //using string for year because I'm using a composite sort key
            String year = currentNode.path("year").asText();
            String web_url = currentNode.path("web_url").asText();
            String img_url = currentNode.path("img_url").asText();
            //composite sort key
            String year_title = year + "#" + title;

            try {
                table.putItem(new Item()
                        .withPrimaryKey("artist", artist, "year_title", year_title)
                        .withString("title", title)
                        .withString("year", year)
                        .withString("web_url", web_url)
                        .withString("img_url", img_url));
                System.out.println("PutItem succeeded: " + artist + " " + title);

            }
            catch (Exception e) {
                System.err.println("Unable to add movie: " + artist + " " + title);
                System.err.println(e.getMessage());
                break;
            }
        }
        parser.close();
    }
}