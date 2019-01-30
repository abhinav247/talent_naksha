# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM tiangolo/node-frontend:10 as build-stage
 
ENV APP_PATH /app
WORKDIR $APP_PATH

COPY package.json $APP_PATH/
RUN npm install


COPY ./ $APP_PATH/
RUN npm run build

#Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage    /app/build/    /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf