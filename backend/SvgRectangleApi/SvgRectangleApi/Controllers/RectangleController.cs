using System.Globalization;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using Rectangle = SvgRectangleApi.Models.Rectangle;

namespace SvgRectangleApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RectangleController : ControllerBase
    {
        private const string FilePath = "rect.csv";
        private const double DefaultHeight = 100;
        private const double DefaultWidth = 100;

        public RectangleController()
        {
        }

        [HttpGet]
        public Rectangle GetRectangle()
        {
            // If CSV does not exist return default values
            if (!System.IO.File.Exists(FilePath))
            {
                var result = new Rectangle
                {
                    Height = DefaultHeight,
                    Width = DefaultWidth
                };

                return result;
            }

            using var reader = new StreamReader(FilePath);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            var records = csv.GetRecords<Rectangle>().ToList();
            return records.FirstOrDefault() ??
                new Rectangle
                {
                    Height = DefaultHeight,
                    Width = DefaultWidth
                };
        }

        [HttpPost]
        public async Task<ActionResult> ValidateAndUpdateRectangle([FromBody] Rectangle rectangle, CancellationToken cancellationToken) 
        {
            try
            {
                // Validation
                await Task.Delay(10000, cancellationToken);

                // Check if the operation was canceled
                if (cancellationToken.IsCancellationRequested)
                {
                    return StatusCode(499, "Request was canceled.");
                }

                if (rectangle.Width > rectangle.Height)
                {
                    return BadRequest("Width cannot be greater than height! Please try again.");
                }


                // Saving dimensions to CSV file
                if (!System.IO.File.Exists(FilePath))
                {
                    // Create an empty file
                    using (FileStream stream = System.IO.File.Create(FilePath))
                    {
                    }
                }

                using (var writer = new StreamWriter(FilePath, false))
                using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
                {
                    writer.WriteLine("Height,Width");
                    csv.WriteRecord(rectangle);
                }

                return Ok();
            }
            catch (OperationCanceledException)
            {
                return StatusCode(499, "Request was canceled.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}