# Sequence Diagram: Main Order Flow

## Visual Diagram
![Sequence Diagram](./Image/SequenceDiagram.png)

## Workflow Description
This diagram tracks the end-to-end journey of a single order. It demonstrates the asynchronous communication between the backend API, the database, and the various client interfaces (Customer, Store, and Helper).

### 1. Discovery & Selection
The process begins with the **Customer** requesting a list of stores. The **Backend (NestJS)** performs a geospatial query against the **PostgreSQL** database to find shops within a 2km radius. The results are returned to the Customer for browsing.

### 2. Transaction Initiation
Once the Customer selects items and proceeds to checkout, the system creates a "Pending" order entry. The Store Owner is immediately notified via **WebSockets** for a low-latency alert.

### 3. Verification & Acceptance
The **Store Owner** checks physical stock and accepts the order. This updates the state in the database, triggering the **Dispatch Logic**.

### 4. Helper Assignment & Dispatch
The system searches for available **Local Helpers** in the vicinity. Once a Helper accepts the task, the Customer is notified, and live GPS tracking is initiated. The Helper then picks up the packed items from the Kirana store.

### 5. Fulfillment & Closure
The **Helper** completes the delivery at the Customer's location. A security check (like an OTP) is performed, the order status is updated to "Delivered," and the transaction is finalized. Finally, a review request is sent to the Customer to maintain community trust.
