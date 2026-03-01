import { Router } from "express";
import { storeController } from "../controllers/store.controller";
import { authorize } from "../middleware/auth.middleware";

export const storeRouter = Router();

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Get all stores
 *     description: Retrieve a list of all stores in the system
 *     tags: [Stores]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of stores retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       zipCode:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                 total:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/", storeController.getAll);

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Get store by ID
 *     description: Retrieve detailed information about a specific store
 *     tags: [Stores]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 zipCode:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/:id", storeController.getById);

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Create a new store
 *     description: Create a new store (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - city
 *               - state
 *               - zipCode
 *             properties:
 *               name:
 *                 type: string
 *                 example: Downtown Store
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               city:
 *                 type: string
 *                 example: New York
 *               state:
 *                 type: string
 *                 example: NY
 *               zipCode:
 *                 type: string
 *                 example: "10001"
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Store created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
storeRouter.post("/", authorize("ADMIN"), storeController.create);

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Update a store
 *     description: Update store information (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
storeRouter.put("/:id", authorize("ADMIN"), storeController.update);

/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Delete a store
 *     description: Delete a store from the system (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
storeRouter.delete("/:id", authorize("ADMIN"), storeController.remove);

/**
 * @swagger
 * /stores/{id}/staff:
 *   get:
 *     summary: Get store staff
 *     description: Retrieve all staff members assigned to a specific store (Admin and Staff only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Staff list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Staff or Admin access required
 *       404:
 *         description: Store not found
 *       500:
 *         description: Internal server error
 */
storeRouter.get("/:id/staff", authorize("ADMIN", "STAFF"), storeController.getStaff);

/**
 * @swagger
 * /stores/{id}/staff:
 *   post:
 *     summary: Assign staff to store
 *     description: Assign a staff member to a specific store (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID of the staff member to assign
 *     responses:
 *       200:
 *         description: Staff assigned successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Store or user not found
 *       500:
 *         description: Internal server error
 */
storeRouter.post("/:id/staff", authorize("ADMIN"), storeController.assignStaff);

/**
 * @swagger
 * /stores/{id}/staff/{userId}:
 *   delete:
 *     summary: Remove staff from store
 *     description: Remove a staff member from a specific store (Admin only)
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Store ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the staff member to remove
 *     responses:
 *       200:
 *         description: Staff removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Store or user not found
 *       500:
 *         description: Internal server error
 */
storeRouter.delete("/:id/staff/:userId", authorize("ADMIN"), storeController.removeStaff);
