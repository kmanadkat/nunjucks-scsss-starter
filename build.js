const nunjucks = require('nunjucks');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const sass = require('sass');
const chokidar = require('chokidar');
const CleanCSS = require('clean-css');
const { minify } = require('html-minifier-terser');

const srcDir = './src';
const distDir = './dist';
const assetsDir = `${srcDir}/assets`;
const isDev = process.argv.includes('--watch');

const env = nunjucks.configure(srcDir, { autoescape: true, noCache: true });
env.addGlobal('dev', isDev);

function buildCSS() {
	const scssInput = path.join(srcDir, 'scss', 'main.scss');
	const cssOutput = path.join(distDir, 'assets', 'css', 'style.css');
	try {
		const result = sass.compile(scssInput);
		const minified = new CleanCSS().minify(result.css);
		fs.outputFileSync(cssOutput, minified.styles);
		console.log('Compiled and minified SCSS -> CSS');
	} catch (e) {
		console.error('SCSS compilation error:', e);
	}
}

async function buildPages() {
	const pages = glob.sync(`${srcDir}/pages/**/*.njk`);

	for (const file of pages) {
		// 1. Path relative to srcDir, e.g., "pages/about/contact.njk"
		const relativePath = path.relative(srcDir, file).replace(/\\/g, '/');

		// 2. Load page‑specific (and global) data
		const data = loadDataForTemplate(file);

		// 3. Render using the shared `env` (with noCache and globals)
		const rendered = env.render(relativePath, data);

		// 4. Compute output path under dist, preserving nested structure
		const outputPath = relativePath
			.replace(/^pages\//, '') // remove "pages/" prefix
			.replace(/\.njk$/, '.html'); // change file extension to .html

		const outFile = path.join(distDir, outputPath);

		// Minify and write
		const minifiedHTML = await minify(rendered, {
			collapseWhitespace: true,
			removeComments: true,
			minifyJS: true,
			minifyCSS: true,
		});

		fs.outputFileSync(outFile, minifiedHTML, 'utf-8');
		console.log(`Built and minified: ${outFile}`);
	}
}

// Helper function to find data file based on template file path
function loadDataForTemplate(filePath) {
	const name = path.basename(filePath, '.njk');
	const dataPath = `${srcDir}/data/${name}.json`;
	return fs.existsSync(dataPath) ? fs.readJsonSync(dataPath) : {};
}

function copyAssets() {
	if (fs.existsSync(assetsDir)) {
		fs.copySync(assetsDir, `${distDir}/assets`, {
			filter: (src) => {
				// Exclude compiled SCSS output if it exists in src
				return !src.endsWith('css/style.css');
			},
		});
		console.log('Copied static assets');
	}
}

async function build() {
	fs.ensureDirSync(distDir);
	buildCSS();
	await buildPages();
	copyAssets();
}

if (process.argv.includes('--watch')) {
	const express = require('express');
	const WebSocket = require('ws');

	// 1. Launch Express to serve dist/
	const app = express();
	app.use(express.static(distDir));
	const server = app.listen(3000, () => {
		console.log('Dev server running at http://localhost:3000');
	});

	// 2. Attach a WebSocket server for reload notifications
	const wss = new WebSocket.Server({ server });
	function broadcastReload() {
		wss.clients.forEach((ws) => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send('reload');
			}
		});
	}

	// 3. Hook into your existing chokidar watcher
	chokidar.watch(srcDir).on('change', async (filePath) => {
		console.log(`File changed: ${filePath}`);
		await build();
		broadcastReload();
	});
}

build();
