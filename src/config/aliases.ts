import moduleAlias from 'module-alias';
import path from 'path';

// Register aliases
moduleAlias.addAliases({
  '@root': path.join(__dirname, '..'),
  '@config': path.join(__dirname),
  '@controllers': path.join(__dirname, '../controllers'),
  '@cron': path.join(__dirname, '../cron'),
  '@middleware': path.join(__dirname, '../middleware'),
  '@models': path.join(__dirname, '../models'),
  '@routes': path.join(__dirname, '../routes'),
  '@services': path.join(__dirname, '../services'),
  '@appTypes': path.join(__dirname, '../types'),
  '@utils': path.join(__dirname, '../utils'),
});
