using System.ComponentModel.DataAnnotations;

namespace Backend.Application.DTOs.Question;

public class UpdateQuestionDto
{
    [Required]
    public string Title { get; set; } = null!;

    [Required]
    public string Content { get; set; } = null!;
}