import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: "https://docs.sean.cyou",
	integrations: [
		starlight({
			title: "Sean's Docs",
			social: {
				github: 'https://github.com/devramsean0',
			},
			sidebar: [
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' }
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
