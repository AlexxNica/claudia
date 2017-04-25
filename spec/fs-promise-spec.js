/*global describe, it, beforeEach, afterEach, expect */
const shell = require('shelljs'),
	tmppath = require('../src/util/tmppath'),
	path = require('path'),
	fs = require('fs'),
	fsPromise = require('../src/util/fs-promise');
describe('fs-promise', () => {
	'use strict';
	let workingdir, testRunName, filePath;
	beforeEach(() => {
		workingdir = tmppath();
		shell.mkdir(workingdir);
		testRunName = 'test' + Date.now();
		filePath = path.join(workingdir, testRunName);
	});
	afterEach(() => {
		shell.rm('-rf', workingdir);
	});
	describe('readFileAsync', () => {
		it('reads file contents', done => {
			fs.writeFileSync(filePath, 'fileContents-123', 'utf8');
			fsPromise.readFileAsync(filePath, 'utf8')
			.then(contents => expect(contents).toEqual('fileContents-123'))
			.then(done, done.fail);
		});
		it('fails if no file', done => {
			fsPromise.readFileAsync(filePath, 'utf8')
			.then(done.fail, done);
		});
	});
	describe('writeFileAsync', () => {
		it('writes file contents', done => {
			fsPromise.writeFileAsync(filePath, 'fileContents-123', 'utf8')
			.then(() => {
				const contents = fs.readFileSync(filePath, 'utf8');
				expect(contents).toEqual('fileContents-123');
			})
			.then(done, done.fail);
		});
	});
	describe('unlinkAsync', () => {
		it('removes a file', done => {
			fsPromise.writeFileAsync(filePath, 'fileContents-123', 'utf8')
			.then(() => fsPromise.unlinkAsync(filePath))
			.then(() => fs.accessSync(filePath))
			.then(done.fail, done);
		});
	});
	describe('renameAsync', () => {
		it('renames a file', done => {
			const newPath = path.join(workingdir, 'new-file.txt');
			fsPromise.writeFileAsync(filePath, 'fileContents-123', 'utf8')
			.then(() => fsPromise.renameAsync(filePath, newPath))
			.then(() => expect(fs.readFileSync(newPath, 'utf8')).toEqual('fileContents-123'))
			.then(() => fs.accessSync(filePath))
			.then(done.fail, done);
		});
	});
});
