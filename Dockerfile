# Stage 1: Build the React.js project
FROM node:14 AS frontend-build
WORKDIR /src/MSO.BFF/Frontend
COPY src/MSO.BFF/Frontend/package*.json ./
RUN npm install
COPY src/MSO.BFF/Frontend ./
RUN npm run build

# Stage 2: Build and publish the .NET solution
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS dotnet-build
WORKDIR /src
COPY src .
RUN dotnet restore MSO.BFF/MSO.BFF.csproj
RUN dotnet publish MSO.BFF/MSO.BFF.csproj -c Release -o /src/publish

# Stage 3: Create the final runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /src
RUN mkdir /src/Frontend
COPY --from=dotnet-build /src/publish .
COPY --from=frontend-build /src/MSO.BFF/Build ./Frontend 
EXPOSE 80
ENTRYPOINT ["dotnet", "MSO.BFF.dll"]
