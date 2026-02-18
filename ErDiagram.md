# Entity Relationship Diagram (ERD)

## Visual Diagram
![ER Diagram](./Image/erdiagram.png)

## Database Schema Design
The schema is designed for a relational PostgreSQL database to ensure data integrity and complex querying capabilities (especially for geospatial searches).

### Key Entities & Attributes

#### 1. Identity Management
*   **Users:** Stores credentials, contact info, and roles.
*   **HelperProfile:** Extended information for partners, including vehicle details and live availability status.

#### 2. Discovery & Inventory
*   **Stores:** Includes a `geometry` column (PostGIS) for high-performance radius searches.
*   **Products:** A master catalog for all items available on the platform.
*   **Inventory:** A junction table matching Products to Stores, maintaining the `stock_level` and specific `price` for that location.

#### 3. Transactional Flow
*   **Orders:** Tracks the lifecycle of a sale. It uses foreign keys to link to the Customer, Store, and current Status.
*   **OrderItem:** Captures a snapshot of the product price and quantity at the time of purchase to ensure historical accuracy even if inventory prices change.

#### 4. Fulfillment & Finance
*   **Payment:** Records transaction IDs and methods (UPI, Card, COD) to prevent double-billing and handle refunds.
*   **Delivery:** Manages the link between an Order and the Helper, storing timestamps for assignment and completion to calculate delivery performance.
