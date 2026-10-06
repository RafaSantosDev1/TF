using System.ComponentModel.DataAnnotations;

namespace Backend.Application.DTOs.Answer;

public class UpdateAnswerDto
{
    [Required]
    public string Content { get; set; } = null!;
}