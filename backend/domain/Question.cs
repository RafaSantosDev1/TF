using Backend.Domain.Enums;

namespace Backend.Domain;

public class Question
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public Guid AuthorId { get; set; }

    public Area Area { get; set; }

    public Guid? AcceptedAnswerId { get; set; }

    public User Author { get; set; } = null!;

    public ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public Answer? AcceptedAnswer { get; set; }
}