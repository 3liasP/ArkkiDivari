import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
    {
        ignores: ['**/*.test.js', '**/*.spec.js', '**/tests/**', '**/dist/**'],
    },
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        settings: { react: { version: '18.3' } },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            'no-unused-vars': 'error',
            'prefer-const': 'warn',
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/prop-types': 'off',
            'react/jsx-no-target-blank': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-vars': 'error',
            'react/jsx-uses-react': 'error',
        },
    },
];
