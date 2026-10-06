using System.ComponentModel.DataAnnotations;

namespace Backend.Application.DTOs.Answer;

public class CreateAnswerDto
{
    [Required]
    public string Content { get; set; } = null!;

    [Required]
    public Guid AuthorId { get; set; }

    [Required]
    public Guid QuestionId { get; set; }
}