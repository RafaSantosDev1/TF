using Backend.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AreasController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<string>> GetAll()
        => Ok(Enum.GetNames<Area>());
}