# Solr Integration for Fitness Club Application (Simulated Version)

This document outlines the implementation of a simulated Apache Solr search engine in this application.

## What is Apache Solr?

Apache Solr is an open-source search platform built on Apache Lucene. It provides distributed indexing, replication, load-balanced querying, and automated failover and recovery.

## About This Implementation

For the purposes of this assignment, we've implemented a simulated version of Solr that doesn't require installing an actual Solr server. This approach demonstrates the same concepts and architecture as a real Solr integration would, but with the following advantages:

- No need to install or configure an external Solr server
- No Java version compatibility issues
- Works immediately without any additional setup
- Easy to understand for educational/assignment purposes

## How It Works

The simulated implementation:

1. Creates an in-memory index to store documents
2. Provides the same API as a real Solr implementation
3. Supports all the core search functionality:
   - Full-text search
   - Entity-specific searches
   - Filtering and pagination

## Setup

### 1. Configure Environment Variables

Your .env file already includes the Solr configuration that would be used in a real implementation:

```
SOLR_HOST=localhost
SOLR_PORT=8983
SOLR_PROTOCOL=http
SOLR_CORE=fitness_club
SOLR_PATH=/solr
```

While these variables are loaded and used in the logging, the simulated implementation doesn't actually connect to a Solr server.

### 2. Install Required Dependencies

The project uses axios for the real implementation, but it's not required for the simulation:

```
npm install axios --save
```

## Usage

### Indexing Data

To index all data from the database into the simulated Solr index:

```
npm run reindex
```

This command will:
1. Clear any existing data in the simulated index
2. Fetch all members, clubs, and employees from the database
3. Convert them to Solr document formats
4. Add them to the in-memory index

### Search API Endpoints

The following endpoints are available for searching:

- `GET /search` - Search across all entities
- `GET /search/members` - Search only members
- `GET /search/clubs` - Search only clubs
- `GET /search/employees` - Search only employees (restricted access)
- `POST /search/reindex` - Trigger full reindexing (admin only)

### Query Parameters

- `q`: Search query (text to search for)
- `type`: Filter by entity type (member, club, employee)
- `offset`: Number of results to skip (pagination)
- `limit`: Maximum number of results to return
- `sort`: Field and direction for sorting (e.g., "firstname asc")

### Example Query

```
GET /search?q=john&limit=10&offset=0
```

## Implementation Details

The simulated Solr implementation is located in `service/search.service.ts`. It includes:

- An in-memory data structure to store indexed documents
- Methods for adding, deleting, and searching documents
- Entity conversion logic to transform database objects to search documents
- A text search algorithm that mimics Solr's basic search capabilities

## Moving to a Real Solr Implementation

If you wanted to move to a real Solr implementation in the future:

1. Install Apache Solr
2. Create a core/collection named after your SOLR_CORE environment variable
3. Replace the SimulatedSolrClient with a real client using axios
4. Update the schema in Solr to match your document structure

## For Assignment Purposes

This simulated implementation satisfies the requirements of demonstrating Solr integration concepts without requiring the complexities of setting up a real Solr server.