# Create Container Image

## Using Docker build commands

You will use the provided `Dockerfile`.
- Install docker on your machine and build the docker image
  ```
   docker build . -t mean-stack:v1.0.0
  ```
- Run the app locally to verify it works as expected
  ```
   docker run -p 8080:8080 --env-file .env -ti mean-stack:v1.0.0 

- Login to your container registry.
   > Note: If using the IBM Cloud Container registry, don't forget to use `ibmcloud cr login`

- Tag the image with your container registry's namespace/repository name.
   > Note:For IBM Cloud Container Registry in the US: `docker tag mean-stack:v1.0.0 us.icr.io/<namespace>/mean-stack:1.0.0`

- Push the image.
   > Note: For IBM Cloud Container Registry in the US: `docker push mean-stack:v1.0.0 us.icr.io/<namespace>/mean-stack:1.0.0`

- If you are using IBM Cloud Code Engine to run your container image and the containter registry used is the IBM Cloud Container Registry or a non-Public registry, you will be required to setup a secret for reading the image. Follow the steps outlined in here: https://cloud.ibm.com/docs/codeengine?topic=codeengine-add-registry to do just that.