// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import airbnbBase from 'eslint-config-airbnb-base';
import airbnbTypescript from 'eslint-config-airbnb-typescript';
import prettierConfig from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';


export default [
	{
		ignores: [
			'SvgIcons/**',
			'build/**',
			'storybook-static/**',
			'node_modules/**',
			'public/**',
			'src/assets/**',
			'src/components/icon/**',
			'src/styles/**',
			'src/reportWebVitals.ts',
		],
	},
	{
		files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			'jsx-a11y': jsxA11y,
			prettier,
			'eslint-comments': eslintComments,
			import: importPlugin,
      'unused-imports': unusedImports,
		},
		settings: {
			'import/ignore': ['node_modules'],
			react: {
				version: 'detect',
			},
		},
		rules: {
			...js.configs.recommended.rules,
			...airbnbBase.rules,
			...airbnbTypescript.rules,
			...prettierConfig.rules,
			'flowtype/*': 'off', // Desativa todas as regras do flowtype
			'prettier/prettier': ['warn'],
			'no-use-before-define': 'off',
			'no-case-declarations': 'off',
			'no-underscore-dangle': 'off',
			'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
			'no-param-reassign': 'off',
			'no-empty': 'warn',
			'import/no-extraneous-dependencies': ['warn', { peerDependencies: false }],
			'react/jsx-props-no-spreading': 'warn',
			'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
			'jsx-a11y/label-has-associated-control': [
				2,
				{
					labelComponents: ['Label'],
					labelAttributes: ['htmlFor'],
					controlComponents: ['Input'],
					assert: 'htmlFor',
					depth: 3,
				},
			],
			'react-hooks/exhaustive-deps': 'error',
			'react-hooks/rules-of-hooks': 'error',
			'react/function-component-definition': [
				2,
				{
					namedComponents: 'arrow-function',
					unnamedComponents: 'arrow-function',
				},
			],
			'react/no-arrow-function-lifecycle': 'off',
			'react/no-invalid-html-attribute': 'off',
			'react/no-unused-class-component-methods': 'off',
			'import/no-anonymous-default-export': [
				'error',
				{
					allowArray: true,
					allowArrowFunction: false,
					allowAnonymousClass: false,
					allowAnonymousFunction: false,
					allowCallExpression: true,
					allowLiteral: false,
					allowObject: true,
				},
			],
			'unused-imports/no-unused-imports': 'warn',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
];
