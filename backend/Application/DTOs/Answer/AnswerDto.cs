namespace Backend.Application.DTOs.Answer;

public class AnswerDto
{
    public Guid Id { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public Guid AuthorId { get; set; }

    public string AuthorName { get; set; } = null!;

    public Guid QuestionId { get; set; }

    public int LikesCount { get; set; }
}