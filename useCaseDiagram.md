# Use Case Diagram

## Visual Diagram
![Use Case Diagram](./Image/UseCaseDiagram.png)

## Functional Overview
The Use Case diagram illustrates the core functional requirements of the Hyperlocal Kirana Platform. It identifies the primary actors and their interactions with the system to fulfill the business goals of quick-commerce.

### Primary Actors
*   **Customer:** The end-user who drives the revenue. Their primary use cases include searching for nearby stores, managing a shopping cart, performing secure checkouts, and tracking their delivery status in real-time.
*   **Store Owner:** The business partner. They use the system to process incoming orders and manage the high-level business profile of their Kirana shop.
*   **Local Helper:** The operational backbone. They are responsible for the physical aspects of the business, such as updating shelf stock levels (inventory management) and performing the actual pick-up and delivery tasks.
*   **Admin:** The platform moderator. They oversee user management, handle financial payouts, and resolve disputes between other actors.

## Key System Use Cases
1.  **Authentication:** Secure onboarding and session management for all user roles.
2.  **Hyperlocal Discovery:** Geolocation-based filtering to ensure customers only see shops within a 2km radius.
3.  **Order Management:** A complex flow involving cart management, payment processing, and status transitions.
4.  **Inventory Sync:** Real-time updates specifically designed for helpers to keep digital listings synchronized with physical store shelves.
