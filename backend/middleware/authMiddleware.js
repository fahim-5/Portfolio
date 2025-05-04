// authMiddleware.js
const protect = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    next();
  };
  
  // In your uploadRoutes.js
  router.post('/image', protect, upload.single('image'), uploadImage);