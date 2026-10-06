namespace Backend.Domain;

public class AnswerLike
{
    public Guid UserId { get; set; }

    public Guid AnswerId { get; set; }

    public DateTime CreatedAt { get; set; }

    public User User { get; set; } = null!;

    public Answer Answer { get; set; } = null!;
}