# Contributing

Thank you for your interest in contributing to `live-chat-ui`! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/live-chat-ui.git
   cd live-chat-ui
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Development Workflow

### Running in development mode

```bash
pnpm dev
```

This will watch for changes and rebuild TypeScript definitions automatically.

### Type checking

```bash
pnpm typecheck
```

### Building for release

```bash
pnpm build
```

## Code Style

- Use **TypeScript** for all code
- Follow the existing code structure and naming conventions
- Ensure all exports are properly typed
- Add JSDoc comments for public APIs

## Making Changes

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit with clear messages:

   ```bash
   git commit -m "feat: add new feature" -m "Description of changes"
   ```

3. **Test your changes** thoroughly

4. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub with a clear description

## Commit Message Format

Follow conventional commits:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring
- `test:` for tests
- `chore:` for build, dependencies, etc.

Example:

```
feat: add support for custom message renderer

This allows users to render messages with custom React components.
```

## Pull Request Process

1. Update documentation and types as needed
2. Include a clear description of changes
3. Reference any related issues: `Closes #123`
4. Ensure your code builds without errors: `pnpm build && pnpm typecheck`

## Reporting Issues

- Check if the issue already exists
- Provide a clear description
- Include reproduction steps if it's a bug
- Specify your environment (React version, Socket.IO version, etc.)

## Questions?

Open a GitHub issue with the `question` label or reach out to the maintainers.
