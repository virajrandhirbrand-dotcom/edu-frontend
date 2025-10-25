# Vercel Deployment Guide

This guide will help you deploy your React frontend to Vercel and connect it to your backend.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Git repository with your code
3. Node.js installed locally

## Deployment Steps

### Method 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No** (for first deployment)
   - Project name: **frontend** (or your preferred name)
   - Directory: **./** (current directory)
   - Override settings? **No**

### Method 2: Deploy via Vercel Dashboard

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure project settings:**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

- **VITE_API_URL**: `https://edu-backend-qss8.vercel.app`

## Project Configuration

The following files have been created/configured for Vercel deployment:

### `vercel.json`
- Configures build settings and routing
- Sets up SPA routing for React Router
- Defines environment variables

### `vite.config.js`
- Optimizes build for production
- Configures code splitting
- Sets up proper chunking for better performance

### `src/api.js`
- Updated to use environment variables
- Falls back to hardcoded URL if env var not set

## Build Commands

- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Preview**: `npm run preview`

## Deployment Features

✅ **Automatic deployments** on Git push  
✅ **Preview deployments** for pull requests  
✅ **Environment variables** support  
✅ **Custom domains** support  
✅ **HTTPS** enabled by default  
✅ **Global CDN** for fast loading  

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are in `package.json`
2. **API calls fail**: Verify environment variables are set in Vercel dashboard
3. **Routing issues**: Ensure `vercel.json` has proper SPA routing configuration

### Useful Commands:

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Redeploy
vercel --prod
```

## Post-Deployment

After successful deployment:

1. **Test your application** at the provided Vercel URL
2. **Verify API connectivity** by testing login/registration
3. **Check console** for any errors
4. **Set up custom domain** (optional) in Vercel dashboard

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Router Documentation](https://reactrouter.com/)

---

Your frontend will be deployed at: `https://your-project-name.vercel.app`
