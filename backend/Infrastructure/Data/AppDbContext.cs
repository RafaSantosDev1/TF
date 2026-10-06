using Backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace Backend.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<UserArea> UserAreas { get; set; }

    public DbSet<Question> Questions { get; set; }

    public DbSet<Answer> Answers { get; set; }

    public DbSet<AnswerLike> AnswerLikes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}