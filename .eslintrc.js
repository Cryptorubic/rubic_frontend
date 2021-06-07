module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.*?.json', 'e2e/tsconfig.e2e.json'],
        tsconfigRootDir: __dirname,
        createDefaultProgram: true
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'airbnb-typescript/base',
        'plugin:prettier/recommended'
      ],
      rules: {
        'import/prefer-default-export': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
        'no-plusplus': 'off',
        'class-method-use-this': 'off',
        'no-underscore-dangle': 'off',
        'no-inferrable-types': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'all',
            ignoreRestSiblings: false,
            argsIgnorePattern: '^_'
          }
        ],
        '@angular-eslint/no-output-on-prefix': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@angular-eslint/no-input-rename': 'off',
        'class-methods-use-this': 'off',
        complexity: ['error', 20],
        eqeqeq: ['error', 'always'],
        'no-magic-numbers': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'enumMember',
            format: ['UPPER_CASE']
          }
        ],
        // Styling.
        'array-bracket-spacing': ['error', 'never'],
        'object-curly-spacing': ['error', 'always'],
        // Temporary rules. Remove after full refactoring.
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/dot-notation': 'off',
        'no-restricted-globals': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'no-param-reassign': 'off',
        // Temporary rules. Remove as fast as it can be.
        'max-classes-per-file': 'off',
        radix: ['warn', 'as-needed'],
        'no-prototype-builtins': 'off',
        'no-return-assign': 'off',
        'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
        'no-console': [
          'warn',
          {
            allow: ['debug', 'error', 'info']
          }
        ],
        'prefer-destructuring': ['error', {'object': true, 'array': false}]
      }
    },
    {
      files: ['*.component.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        'max-len': ['warn', { code: 200 }]
      }
    },
    {
      files: ['*.component.ts'],
      extends: ['plugin:@angular-eslint/template/process-inline-templates']
    },
    {
      files: ['src/**/*.spec.ts', 'src/**/*.d.ts'],
      parserOptions: {
        project: './src/tsconfig.spec.json'
      },
      extends: ['plugin:jasmine/recommended'],
      plugins: ['jasmine'],
      env: { jasmine: true },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
};
