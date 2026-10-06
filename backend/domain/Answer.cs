namespace Backend.Domain;

public class Answer
{
    public Guid Id { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public Guid AuthorId { get; set; }

    public Guid QuestionId { get; set; }

    public User Author { get; set; } = null!;

    public Question Question { get; set; } = null!;

    public ICollection<AnswerLike> Likes { get; set; } = new List<AnswerLike>();
}