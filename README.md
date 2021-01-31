# [Next.js](https://nextjs.org/) + bootsrap test project

## Configuration

```shell
# copy .env.production to .env.local
cp .env.production .env.local

# edit .env.local to fill actual URLS 
# NEXTAUTH_URL= http://18.195.20.220:80
# NEXT_PUBLIC_GRAPHQL_URL = http://18.195.20.220:4000

# install deps 
yarn install

# build
yarn build

# run 
yarn start 
```

## Making available on port 80

```shell
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
# install following utility to persist iptables changes after reboot

sudo apt-get install iptables-persistent


```

## pm2 ecosystem file for all services

```js
module.exports = {
    apps: [
        {
            name: 'strapi',
            cwd: '/home/ubuntu/strapi-test',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'finhub-web-api',
            cwd: '/home/ubuntu/finhub-web-api',
            script: './gateway.js',
        },
        {
            name: 'finhub-web-front',
            cwd: '/home/ubuntu/finhub-web-front',
            script: 'yarn',
            args: 'start',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};

```

## Scope

- Some pages with layout
- login / registration
- user name in header
- closed/open pages
- user custom page

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions
are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
