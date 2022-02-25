# Create Container Image

> If you are using IBM Cloud Code Engine to run your container image and the containter registry used is the IBM Cloud Container Registry or a non-Public registry, you will be required to setup a secret for reading the image. Follow the steps outlined in here: https://cloud.ibm.com/docs/codeengine?topic=codeengine-add-registry to do just that.

## Using Docker build commands
This example is using Docker to build the image.

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
   > Note: For IBM Cloud Container Registry in the US: `docker tag mean-stack:v1.0.0 us.icr.io/<namespace>/mean-stack:1.0.0`

- Push the image.
   > Note: For IBM Cloud Container Registry in the US: `docker push mean-stack:v1.0.0 us.icr.io/<namespace>/mean-stack:1.0.0`

- If you are using IBM Cloud Code Engine to run your container image and the containter registry used is the IBM Cloud Container Registry or a non-Public registry, you will be required to setup a secret for reading the image. Follow the steps outlined in here: https://cloud.ibm.com/docs/codeengine?topic=codeengine-add-registry to do just that.

## Using Code Engine build commands
Don't have Docker installed locally, this example uses Code Engine to build and publish the image.

You will use the provided `Dockerfile`.

- Create a registry secret to push images to the container registry you are using:
   ```
      ibmcloud ce registry create --name myregistry --server <registry> --username <username> --password <apikey-access_token-password>
   ```
  >  Note: For IBM Cloud Container Registry: `ibmcloud ce registry create --name <secret-name>` you are prompted for your IAM APIkey value and the username is defaulted to `iamapikey`.

- Create a new image build: 
   ```
      ibmcloud ce build create --name mean-stack-local-build --build-type local --image <registry><namespace-repository>/sample --registry-secret <secret-name> --dockerfile Dockerfile --strategy dockerfile --size medium
   ```
   > Note: For IBM Cloud Container Registry in the US: `ibmcloud ce build create --name mean-stack-local-build --build-type local --image us.icr.io/<namespace>/sample --registry-secret <secret-name> --dockerfile Dockerfile --strategy dockerfile --size medium`

- Run the build and push to the registry
   ```
      ibmcloud ce buildrun submit --build mean-stack-local-build --source .
   ```

