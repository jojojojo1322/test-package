declare const eslintConfig: {
    root: boolean;
    env: {
        browser: boolean;
        es2021: boolean;
        node: boolean;
    };
    parser: string;
    parserOptions: {
        ecmaFeatures: {
            jsx: boolean;
        };
        sourceType: string;
        ecmaVersion: string;
    };
    settings: {
        react: {
            version: string;
        };
    };
    plugins: string[];
    extends: string[];
    rules: {
        "react/react-in-jsx-scope": string;
        "@typescript-eslint/explicit-module-boundary-types": string;
        "@typescript-eslint/no-explicit-any": string;
        "react/prop-types": string;
    };
    ignorePatterns: string[];
};

declare const prettierConfig: {
    printWidth: number;
    tabWidth: number;
    semi: boolean;
    singleQuote: boolean;
    trailingComma: string;
    bracketSpacing: boolean;
    arrowParens: string;
    endOfLine: string;
};

export { eslintConfig, prettierConfig };
