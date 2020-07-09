import express from 'express';
import asyncHandler from 'express-async-handler';
import sanitizeQuery from '../middleware/sanitize-query';
import validateQuery from '../middleware/validate-query';
import * as SettingsService from '../services/settings';
import useCollection from '../middleware/use-collection';

const router = express.Router();

router.get(
	'/',
	useCollection('directus_settings'),
	sanitizeQuery,
	validateQuery,
	asyncHandler(async (req, res) => {
		const records = await SettingsService.readSettings(req.sanitizedQuery);
		return res.json({ data: records });
	})
);

router.patch(
	'/',
	useCollection('directus_settings'),
	sanitizeQuery,
	validateQuery,
	asyncHandler(async (req, res) => {
		const primaryKey = await SettingsService.updateSettings(
			req.params.pk /** @TODO Singleton */,
			req.body,
			{
				ip: req.ip,
				userAgent: req.get('user-agent'),
				user: req.user,
			}
		);

		const record = await SettingsService.readSettings(req.sanitizedQuery);

		return res.json({ data: record });
	})
);

export default router;
