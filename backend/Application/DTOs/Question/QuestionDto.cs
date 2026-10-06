using Backend.Application.DTOs.Answer;
using Backend.Domain.Enums;

namespace Backend.Application.DTOs.Question;

public class QuestionDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public Guid AuthorId { get; set; }

    public string AuthorName { get; set; } = null!;

    public Area Area { get; set; }

    public Guid? AcceptedAnswerId { get; set; }

    public int AnswersCount { get; set; }

    public List<AnswerDto> Answers { get; set; } = [];
}