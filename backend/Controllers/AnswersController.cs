using Backend.Application.DTOs.Answer;
using Backend.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnswersController : ControllerBase
{
    private readonly AnswerService _answerService;

    public AnswersController(AnswerService answerService)
    {
        _answerService = answerService;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<AnswerDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var answer = await _answerService.GetByIdAsync(id, cancellationToken);
        return answer is null ? NotFound() : Ok(answer);
    }

    [HttpGet("question/{questionId:guid}")]
    public async Task<ActionResult<IEnumerable<AnswerDto>>> GetByQuestion(Guid questionId, CancellationToken cancellationToken)
        => Ok(await _answerService.GetAllByQuestionIdAsync(questionId, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<AnswerDto>> Create(CreateAnswerDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var answer = await _answerService.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = answer.Id }, answer);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AnswerDto>> Update(Guid id, UpdateAnswerDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var answer = await _answerService.UpdateAsync(id, dto, cancellationToken);
        return answer is null ? NotFound() : Ok(answer);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _answerService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("{answerId:guid}/like")]
    public async Task<ActionResult> Like(Guid answerId, [FromQuery] Guid userId, CancellationToken cancellationToken)
    {
        try
        {
            var likesCount = await _answerService.LikeAsync(answerId, userId, cancellationToken);
            return Ok(new { LikesCount = likesCount });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{answerId:guid}/like")]
    public async Task<ActionResult> Unlike(Guid answerId, [FromQuery] Guid userId, CancellationToken cancellationToken)
    {
        try
        {
            var likesCount = await _answerService.UnlikeAsync(answerId, userId, cancellationToken);
            return Ok(new { LikesCount = likesCount });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}