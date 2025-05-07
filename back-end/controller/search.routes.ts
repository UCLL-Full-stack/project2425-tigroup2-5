import express from 'express';
import { Request, Response } from 'express';
import searchService from '../service/search.service';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search across all entities
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [member, club, employee]
 *         description: Filter by entity type
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of results to skip
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: Search results
 *       401:
 *         description: Not authenticated
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '*';
    const filters = {
      type: req.query.type as string,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      sort: req.query.sort as string
    };
    
    const results = await searchService.search(query, filters);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

/**
 * @swagger
 * /search/members:
 *   get:
 *     summary: Search members
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Member search results
 *       401:
 *         description: Not authenticated
 */
router.get('/members', authenticate, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '*';
    const options = {
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };
    
    const results = await searchService.searchMembers(query, options);
    res.json(results);
  } catch (error) {
    console.error('Member search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

/**
 * @swagger
 * /search/clubs:
 *   get:
 *     summary: Search clubs
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Club search results
 *       401:
 *         description: Not authenticated
 */
router.get('/clubs', authenticate, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '*';
    const options = {
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };
    
    const results = await searchService.searchClubs(query, options);
    res.json(results);
  } catch (error) {
    console.error('Club search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

/**
 * @swagger
 * /search/employees:
 *   get:
 *     summary: Search employees
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Employee search results
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.get('/employees', authenticate, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '*';
    const options = {
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    };
    
    // Only admins and employees can search employees
    if (req.user.role !== 'admin' && req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Not authorized to search employees' });
    }
    
    const results = await searchService.searchEmployees(query, options);
    res.json(results);
  } catch (error) {
    console.error('Employee search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

/**
 * @swagger
 * /search/reindex:
 *   post:
 *     summary: Reindex all data
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reindexing successful
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.post('/reindex', authenticate, isAdmin, async (req: Request, res: Response) => {
  try {
    await searchService.reindexAll();
    res.json({ message: 'Reindexing completed successfully' });
  } catch (error) {
    console.error('Reindex error:', error);
    res.status(500).json({ message: 'Reindexing failed' });
  }
});

export default router;