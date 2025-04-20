import express from 'express';
import { storage } from '../storage';

export const csServersRouter = express.Router();

// Get all CS servers
csServersRouter.get('/api/cs-servers', async (_req, res) => {
  try {
    const servers = await storage.getCsServers();
    res.json(servers);
  } catch (error) {
    console.error('Error fetching CS servers:', error);
    res.status(500).json({ error: 'Failed to fetch CS servers' });
  }
});

// Get server by ID
csServersRouter.get('/api/cs-servers/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid server ID' });
    }
    
    const server = await storage.getCsServer(id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    res.json(server);
  } catch (error) {
    console.error('Error fetching CS server:', error);
    res.status(500).json({ error: 'Failed to fetch CS server' });
  }
});

// Update server likes
csServersRouter.post('/api/cs-servers/:id/like', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid server ID' });
    }
    
    const server = await storage.getCsServer(id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    const updatedServer = await storage.updateCsServerLikes(id);
    res.json(updatedServer);
  } catch (error) {
    console.error('Error updating CS server likes:', error);
    res.status(500).json({ error: 'Failed to update server likes' });
  }
});

// Update server status and player count
csServersRouter.put('/api/cs-servers/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid server ID' });
    }
    
    const { status, players } = req.body;
    if (typeof status !== 'boolean' || (players !== undefined && typeof players !== 'number')) {
      return res.status(400).json({ error: 'Invalid status or players value' });
    }
    
    const server = await storage.getCsServer(id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    const updatedServer = await storage.updateCsServerStatus(id, status, players ?? 0);
    res.json(updatedServer);
  } catch (error) {
    console.error('Error updating CS server status:', error);
    res.status(500).json({ error: 'Failed to update server status' });
  }
});