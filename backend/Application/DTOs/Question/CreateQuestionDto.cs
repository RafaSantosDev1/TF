using System.ComponentModel.DataAnnotations;
using Backend.Domain.Enums;

namespace Backend.Application.DTOs.Question;

public class CreateQuestionDto
{
    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public string Content { get; set; } = null!;

    [Required]
    public Guid AuthorId { get; set; }

    [Required]
    public Area Area { get; set; }
}