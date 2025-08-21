# Blog

A modern blog application built with AdonisJS, Inertia.js, Vue 3, and Shadcn UI components.

## Features

- 📝 **Rich Text Editor** - Powered by Tiptap with extensive formatting options
- 🎨 **Modern UI** - Beautiful interface built with Shadcn UI and Tailwind CSS
- 🔐 **Authentication** - User registration and login system
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🏷️ **Categories** - Organize posts with multiple categories
- ✏️ **Draft System** - Save posts as drafts before publishing
- 🔍 **Pagination** - Navigate through posts efficiently
- 🎯 **Type Safety** - Full TypeScript support

## Tech Stack

- **Backend**: [AdonisJS 6](https://adonisjs.com/) - Node.js framework
- **Frontend**: [Vue 3](https://vuejs.org/) with [Inertia.js](https://inertiajs.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) with [Reka UI](https://reka-ui.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Rich Text**: [Tiptap Editor](https://tiptap.dev/)
- **Database**: SQLite (configurable)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/thonders/blog.git
   cd blog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration.

4. **Generate application key**

   ```bash
   node ace generate:key
   ```

5. **Run database migrations**

   ```bash
   node ace migration:run
   ```

6. **Seed the database (optional)**
   ```bash
   node ace db:seed
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3333`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Author**: Thonder  
**Email**: [i@thond.re](mailto:i@thond.re)
