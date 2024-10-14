# Rectangle SVG App

## Description

This app enables resizing a rectangle inside an SVG image. The initial dimensions are read from `./backend/SvgRectangleApi/SvgRectangleApi/rect.csv`. If you do not create the CSV file, it will set initial values to (100, 100) and create the file for you after the first succesfull resize.

## CSV Example Format

Height,Width</br>
200,200

## Frontend

1. Navigate to the folder `./frontend`
2. Run: `npm start`
   - This starts the app on port 3000.

## Backend

1. Install the SDK and runtime for .NET 8.
2. You can run it using Visual Studio or alternatively:
   - Navigate to the folder `./backend/SvgRectangleApi/SvgRectangleApi`
   - Run: `dotnet run`
     - This starts the backend on port 5171.