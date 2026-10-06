namespace Backend.Domain;

public class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? ProfileImage { get; set; }

    public string? Bio { get; set; }

    public ICollection<UserArea> UserAreas { get; set; } = new List<UserArea>();

    public ICollection<Question> Questions { get; set; } = new List<Question>();

    public ICollection<Answer> Answers { get; set; } = new List<Answer>();

    public ICollection<AnswerLike> AnswerLikes { get; set; } = new List<AnswerLike>();
}