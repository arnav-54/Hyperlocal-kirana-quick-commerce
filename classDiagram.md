# Class Diagram

## Visual Diagram
![Class Diagram](./Image/classDiagram.png)

## Technical Architecture
This diagram represents the object-oriented structure of the TypeScript project. It follows clean architecture principles, ensuring high maintainability and scalability for the hyperlocal ecosystem.

### Core Class Structure
1.  **User Inheritance:** A base `User` class contains common attributes (id, name, phone). Specific roles like `Customer`, `StoreOwner`, and `Helper` extend this base class to inherit common behavior while implementing role-specific methods (e.g., `placeOrder` for Customers, `acceptTask` for Helpers).
2.  **Commerce Entities:**
    *   **Store:** Represents the physical shop, containing its geolocation and linked inventory.
    *   **Product:** The template for items, containing generic data like price and category.
    *   **Inventory:** A bridge entity that manages the specific stock levels and localized pricing for a product at a particular store.
3.  **Transactional Logic:**
    *   **Cart:** A transient entity managed by the Customer to group items before they become an order.
    *   **Order:** The central state machine tracking the status of a purchase from acceptance to delivery.

### Relationships
*   **Composition:** A `Store` consists of many `Products` through its inventory.
*   **Aggregation:** An `Order` contains multiple `OrderItems` which reference specific `Products`.
*   **Associations:** Orders are linked to exactly one `Store` (receiver) and one `Helper` (fulfiller).
