using Backend.Application.DTOs.Question;
using Backend.Application.Services;
using Backend.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly QuestionService _questionService;

    public QuestionsController(QuestionService questionService)
    {
        _questionService = questionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<QuestionDto>>> GetAll(CancellationToken cancellationToken)
        => Ok(await _questionService.GetAllAsync(cancellationToken));

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QuestionDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var question = await _questionService.GetByIdAsync(id, cancellationToken);
        return question is null ? NotFound() : Ok(question);
    }

    [HttpGet("area/{area}")]
    public async Task<ActionResult<IEnumerable<QuestionDto>>> GetByArea(Area area, CancellationToken cancellationToken)
        => Ok(await _questionService.GetByAreaAsync(area, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<QuestionDto>> Create(CreateQuestionDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var question = await _questionService.CreateAsync(dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = question.Id }, question);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<QuestionDto>> Update(Guid id, UpdateQuestionDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var question = await _questionService.UpdateAsync(id, dto, cancellationToken);
        return question is null ? NotFound() : Ok(question);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _questionService.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPut("{questionId:guid}/accepted-answer/{answerId:guid}")]
    public async Task<ActionResult<QuestionDto>> MarkAcceptedAnswer(Guid questionId, Guid answerId, CancellationToken cancellationToken)
    {
        try
        {
            var question = await _questionService.MarkAcceptedAnswerAsync(questionId, answerId, cancellationToken);
            return Ok(question);
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